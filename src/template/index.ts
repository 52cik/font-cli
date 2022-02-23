const icon = () => `
import { FC } from 'react';
import { Icon } from 'antd';
import { IconProps } from 'antd/es/icon';
import { IconFontTypes } from './IconFontTypes';
import './font';

export interface IconFontProps extends IconProps {
  type?: IconFontTypes;
}

// export type { IconFontTypes };

export const IconFont = Icon.createFromIconfontCN() as FC<IconFontProps>;

export default IconFont;
`.trimStart();

export default icon;
