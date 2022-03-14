import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ITvShow } from '../api';
import { makeImagePath } from '../utils';

const Container = styled.div`
	margin-bottom: 80px;
	position: relative;
	z-index: 2;
	padding: 0 60px;
`;

const SectionTitle = styled.h3`
	font-size: 20px;
	font-weight: 500;
	color: ${(props) => props.theme.white.light};
	padding-bottom: 10px;
`;

const SliderBtn = styled.button<{ direction: string }>`
	position: absolute;
	bottom: 0;
	left: ${(props) => (props.direction === 'prev' ? 0 : 'auto')};
	right: ${(props) => (props.direction === 'next' ? 0 : 'auto')};
	height: 8.48vw;
	width: 50px;
	background: transparent;
	border: none;
	outline: none;
	opacity: 0.2;

	&::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: ${(props) =>
			props.direction === 'prev'
				? 'translate(-20%, -50%) rotate(-45deg)'
				: 'translate(-80%, -50%) rotate(135deg)'};
		width: 20px;
		height: 20px;
		border-top: 2px solid ${(props) => props.theme.white.light};
		border-left: 2px solid ${(props) => props.theme.white.light};
	}

	&:hover {
		opacity: 1;
	}
`;

const Wrapper = styled.div`
	position: relative;
	height: 8.48vw;
	z-index: 2;
`;

const Row = styled(motion.div)`
	position: absolute;
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 10px;
	width: 100%;
`;

const Item = styled(motion.div)`
	cursor: pointer;

	&:first-child {
		transform-origin: left center;
	}
	&:last-child {
		transform-origin: right center;
	}

	& > img {
		width: 100%;
	}
`;

const Info = styled(motion.div)`
	position: absolute;
	width: 100%;
	top: 100%;
	left: 0;
	padding: 10px 0;
	background: ${(props) => props.theme.black.light};
	opacity: 0;
	h4 {
		text-align: center;
		font-size: 18px;
	}
`;

const rowVariants = {
	hidden: (back: boolean) => ({
		x: back ? -window.innerWidth : window.innerWidth,
	}),
	visible: {
		x: 0,
	},
	exit: (back: boolean) => ({
		x: back ? window.innerWidth : -window.innerWidth,
	}),
};

const boxVariants = {
	normal: {
		scale: 1,
	},
	hover: {
		scale: 1.3,
		// zIndex: 99,
		transition: {
			delay: 0.5,
			duration: 0.3,
			type: 'tween',
		},
	},
};

const infoVariants = {
	hover: {
		opacity: 1,
		transition: {
			delay: 0.5,
			duration: 0.3,
			type: 'tween',
		},
	},
};

interface ISliderProps {
	data: ITvShow[];
	title: string;
}

const offset = 6;

function Slider({ data, title }: ISliderProps) {
	const navigate = useNavigate();
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const [back, setBack] = useState(false);
	const onBoxClicked = (movieId: number) => {
		navigate(`/tv/${title}/${movieId}`);
	};
	const increaseIndex = () => {
		if (data) {
			if (leaving) return;
			setLeaving(true);
			const totalData = data.length;
			const maxIndex = Math.floor(totalData / offset);
			setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
			setBack(false);
		}
	};
	const decreasIndex = () => {
		if (data) {
			if (leaving) return;
			setLeaving(true);
			const totalData = data.length;
			const maxIndex = Math.floor(totalData / offset);
			setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
			setBack(true);
		}
	};
	const toggleLeaving = () => setLeaving((prev) => !prev);

	return (
		<Container>
			<SectionTitle>{title}</SectionTitle>
			<SliderBtn direction='prev' onClick={decreasIndex} />
			<SliderBtn direction='next' onClick={increaseIndex} />
			<Wrapper>
				<AnimatePresence
					initial={false}
					custom={back}
					onExitComplete={toggleLeaving}
				>
					<Row
						key={title + '_' + index}
						variants={rowVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
						custom={back}
						transition={{ type: 'tween', duration: 1 }}
					>
						{data?.slice(offset * index, offset * index + offset).map((tv) => (
							<Item
								key={title + '_' + tv.id}
								layoutId={title + '_' + tv.id}
								variants={boxVariants}
								whileHover='hover'
								initial='normal'
								transition={{ type: 'tween' }}
								onClick={() => onBoxClicked(tv.id)}
							>
								<img
									src={makeImagePath(tv.backdrop_path, 'w500')}
									alt={tv.name}
								/>
								<Info variants={infoVariants} transition={{ type: 'tween' }}>
									<h4>{tv.name}</h4>
								</Info>
							</Item>
						))}
					</Row>
				</AnimatePresence>
			</Wrapper>
		</Container>
	);
}

export default Slider;
