import clsx from 'clsx'

const borderBase = 'border border-theme-primary/15 disabled:border-dashed'
const borderHover = clsx(borderBase, 'hover:border-theme-primary/30 disabled:hover:border-[unset]')
const borderActive = clsx(borderHover, 'active:border-theme-primary/50 disabled:active:border-[unset]')

const backgroundSecondaryBase = 'bg-theme-primary/5 disabled:text-theme-primary/15 disabled:bg-transparent'
const backgroundSecondaryHover = clsx(backgroundSecondaryBase, 'hover:bg-theme-primary/10 disabled:hover:bg-[unset]')
const backgroundSecondaryActive = clsx(backgroundSecondaryHover, 'active:bg-theme-primary/15 disabled:active:bg-[unset]')

const backgroundPrimaryBase = 'bg-theme-primary disabled:text-theme-primary/15 disabled:bg-transparent'
const backgroundPrimaryHover = clsx(backgroundPrimaryBase, 'hover:bg-theme-primary-light disabled:hover:bg-[unset]')
const backgroundPrimaryActive = clsx(backgroundPrimaryHover, 'active:bg-theme-primary-lighter disabled:active:bg-[unset]')

export {
	borderActive,
	borderBase,
	borderHover,
	backgroundSecondaryActive,
	backgroundSecondaryBase,
	backgroundSecondaryHover,
	backgroundPrimaryActive,
	backgroundPrimaryBase,
	backgroundPrimaryHover,
}
