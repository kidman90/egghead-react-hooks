import React, { useState, useEffect } from 'react';
import Battery from './Battery';
import styled from '@emotion/styled';

const Section = styled('section')`
  height: calc(100vh - 64px);
  margin: 32px;
`;

export default function BatteryPlayground() {
  const [battery, setBattery] = useState({ level: 0, charging: false });
  const handleChange = ({ target: { level, charging } }) =>
    setBattery({ level, charging });

  useEffect(() => {
    let battery;
    navigator.getBattery().then(bat => {
      battery = bat;
      battery.addEventListener("levelchange", handleChange);
      battery.addEventListener("chargingchange", handleChange);
      handleChange({ target: battery });
    });
    return () => {
      battery.removeEventListener("levelchange", handleChange);
      battery.removeEventListener("chargingchange", handleChange);
    };
  }, []);

  return (
    <Section>
      <Battery {...battery} />
    </Section>
  );
}