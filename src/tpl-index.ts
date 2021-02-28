const icon = () => `
import { SFC } from 'react';
import { Icon } from 'antd';
import { IconProps } from 'antd/es/icon';
import type { IconFontTypes } from './IconFontTypes';
import './font';

export interface IconFontProps extends IconProps {
  type?: IconFontTypes;
}

export const IconFont = Icon.createFromIconfontCN() as SFC<IconFontProps>;

export default IconFont;
`.trimStart();

export default icon;
