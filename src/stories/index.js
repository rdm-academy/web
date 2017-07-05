import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import WorkflowEditor from 'components/WorkflowEditor';

const goodExample = `---
input:
  type: data
  title: Input

output:
  type: data
  title: Output

process:
  type: compute
  title: Process
  input:
    - input
  output:
    - output

analysis:
  type: data
  title: Analysis

analyze:
  type: compute
  title: Analyze
  input:
    - output
  output:
    - analysis

result:
  type: data
  title: Result

review:
  type: manual
  title: Review
  input:
    - output
    - analysis
  output:
    - result

paper:
  type: finding
  title: Paper
  input:
    - result
`

const cycle = `---
input:
  type: data
  title: Input

output:
  type: data
  title: Output

process:
  type: compute
  title: Process
  input:
    - input
  output:
    - output

process2:
  type: compute
  title: Process 2
  input:
    - output
  output:
    - input
`

const validationErrors = `---
input:
  type: data
  title: Input

output:
  type:
  title: Output

process:
  type: compute
  title:
  input:
    - inpu
  output:
    - otput

analysis:
  type: data
  title: Analysis

analyze:
  type: compute
  title: Analyze
  inputs:
    - output
  output:
    - analysis

result:
  type: data
  title: Result

review:
  type: manual
  title: Review
  input:
    - output
    - analysis
  output:
    - result
`


storiesOf('WorkflowEditor', module)
  .add('Empty', () => (
    <WorkflowEditor />
  ))
  .add('Good', () => (
    <WorkflowEditor text={goodExample} />
  ))
  .add('Validation Errors', () => (
    <WorkflowEditor text={validationErrors} />
  ))
  .add('Cycle', () => (
    <WorkflowEditor text={cycle} />
  ))
