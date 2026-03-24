import type { DrawerProps } from 'rc-drawer';

export const maskMotion: DrawerProps['maskMotion'] = {
  motionAppear: true,
  motionName: 'mask-motion',
};

export const motion: DrawerProps['motion'] = (placement) => ({
  motionAppear: true,
  motionName: `panel-motion-${placement}`,
});

const motionProps: Partial<DrawerProps> = {
  maskMotion,
  motion,
};

export default motionProps;
