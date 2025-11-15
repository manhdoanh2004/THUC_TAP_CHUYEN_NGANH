/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
type RadioButton= {
    label: string;
    value: string;
}
type RadioButtons={
 arrayButtonRadio:Array<RadioButton>
 ,buttonRadioDefault:any,setButtonRadio:any,
 defaultChecked?:any
}

const RadioButton = ({defaultChecked,arrayButtonRadio,buttonRadioDefault,setButtonRadio}:RadioButtons) => {
   
 

    return (
        <>
            {arrayButtonRadio.length>0?(<>
                 <div className="flex space-x-6">
            {arrayButtonRadio.map((option) => (
              <label key={option.value} className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={buttonRadioDefault === option.value}
                  onChange={(e) => setButtonRadio(e.target.value)}
                  required
                  id="gender"
               
                  className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
            </>):(<></>)}
        </>
        
    );
};

export default RadioButton;