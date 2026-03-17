import * as React from 'react';
import Icon, { type IconProps } from '../Icon';

const CloseIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props} iconType={'stroke'} viewBox="0 0 24 24">
        <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round"/>
        <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round"/>
    </Icon>
  );
};

export default CloseIcon;
