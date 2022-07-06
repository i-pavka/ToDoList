import React, {ButtonHTMLAttributes, DetailedHTMLProps} from 'react'
import s from './SuperButton.module.css'

type DefaultButtonPropsType = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

type SuperButtonPropsType = DefaultButtonPropsType & {
  red?: boolean
  selected?: boolean
}

export const SuperButton: React.FC<SuperButtonPropsType> = React.memo((
  {
    red, className, selected,
    ...restProps
  }
) => {
  // console.log('SuperButton')
  const finalClassName = `${selected ? s.selected : s.default} ${red ? s.red : s.default} ${className}`

  return (
    <button
      className={finalClassName}
      {...restProps}
    />
  )
})
