import React, {useEffect, useState} from 'react';
import ValidatedTextInputStyle from './ValidatedTextInput.module.scss';

const ValidatedTextInput: React.FC<IValidatedTextInput> = (props: any) => {

  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState('');
  const [value, setValue] = useState('');

  /*const textHandler = (value: string) => {
    setIsTouched(true);

    const validState = props.isValid(value, (message: string) => {
      setMessage(message);
    });

    setIsValid(validState);
    validState ? props.value(value) : props.value('');
  };*/

  // after props changes this useEffect is going to be executed!
  useEffect(() => {
    props.initialState((message: string, isValid: boolean, value: string) => {
      setMessage(message);
      setIsValid(isValid);
      setIsTouched(!!message);
      setValue(value);
    }); 
  }, [props]);


  return (
    <div
      className={
        ValidatedTextInputStyle['validated-input-text'] + ' ' +
        (!isTouched ? '' : isValid ? ValidatedTextInputStyle['touched'] : ValidatedTextInputStyle['not-valid'])
      }
    >
      <div
        className={ValidatedTextInputStyle['message-bar']}>
        <div className={ValidatedTextInputStyle['message']}>
          <div>
            {props.others.fieldname + (message ? ': ' : ' ') + (message)}
          </div>
        </div>
      </div>
      <input
        className={ValidatedTextInputStyle['input']}
        type='text'
        name={props.name}
        onChange={
          event => {
            setIsValid(true);
            setIsTouched(true);
            setMessage('');
            setValue(event.target.value)
          }
        }
        value={value}
        {...props.others}
      />
    </div>
  );
}

export interface IValidatedTextInput {
  value: (value: string) => void;
  // isValid: (value: string, setMessage: (message: string) => void) => boolean;
  initialState: (setInputState: (message: string, isValid: boolean, value: string) => void) => void;
  name: string;
  others: object;
}

export default ValidatedTextInput;
