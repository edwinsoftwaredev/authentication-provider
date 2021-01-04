import React, { Fragment } from 'react';
import style from './button.module.scss';

interface IButton {
  classType: string;
  type: 'button' | 'submit' | 'reset' | undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text: string
}

const Button: React.FC<IButton> = (props: IButton) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return (
    <Fragment>
      <button
        className={style['button'] + ' ' + style[props.classType]}
        onClick={handleClick}
        type={props.type}
      >
        {props.text}
      </button>
    </Fragment>
  )
};

export default Button;