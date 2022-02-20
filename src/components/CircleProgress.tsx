import * as React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { AppearanceNames, theme } from '../design/theme';
import { CircleContainer, ContainerSizes } from '../design/components/containers';
import Loading from './Loading';

interface ICircleProgress {
  appearance: AppearanceNames;
  percentage?: number;
  size: ContainerSizes;
}

export default function CircleProgress({ appearance, percentage, size }: ICircleProgress) {
  const colorObj = theme.getAppearanceColor(appearance, 'circle');

  if (typeof percentage === 'number') {
    return (
      <CircleContainer size={size}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          strokeWidth={5}
          styles={buildStyles(colorObj)}
        />
      </CircleContainer>
    );
  } else {
    return <Loading />;
  }
}
