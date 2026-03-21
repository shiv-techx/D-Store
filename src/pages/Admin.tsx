import React from 'react';
import { Studio } from 'sanity';
import config from '../sanity/sanity.config';

export default function Admin() {
  return (
    <div className="h-[calc(100vh-64px)] w-full">
      <Studio config={config} />
    </div>
  );
}
