import React, {ButtonHTMLAttributes, DetailedHTMLProps} from 'react'
import s from './Button.module.css'

type DefaultButtonPropsType = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

type ButtonPropsType = DefaultButtonPropsType & {
  red?: boolean
  selected?: boolean
}

export const Button: React.FC<ButtonPropsType> = React.memo((
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
