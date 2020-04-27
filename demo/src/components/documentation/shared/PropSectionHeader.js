import React from 'react';

import SectionHeading from '../../SectionHeading';
import { Type, Value, Required } from './Highlights';

export default function PropSectionHeader({
  propName,
  types,
  isRequired,
  defaultValue,
}) {
  return (
    <>
      <SectionHeading id={propName}>{propName}</SectionHeading>
      <p>
        <b>type:</b>{' '}
        {types.map((type, index) => (
          <React.Fragment key={type}>
            <Type>{type}</Type>
            {index < types.length - 1 && ' or '}
          </React.Fragment>
        ))}{' '}
        |{' '}
        {defaultValue && (
          <>
            <b>default:</b> <Value>{defaultValue}</Value>
          </>
        )}
        {isRequired && <Required>this prop is required</Required>}
      </p>
    </>
  );
}
