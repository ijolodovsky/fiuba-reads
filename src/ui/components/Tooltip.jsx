import React from 'react';

export const TooltipProvider = ({ children }) => <div>{children}</div>;

export const Tooltip = ({ children }) => <div>{children}</div>;

export const TooltipTrigger = ({ asChild, children }) => (
  <span>{children}</span>
);

export const TooltipContent = ({ children }) => (
  <div className="tooltip-content">{children}</div>
);
