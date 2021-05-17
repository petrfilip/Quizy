import React from 'react';

const UsersLabelsOverview = ({ labels }) => {
  return (
    <div>
      {labels.split(":").map(item => item)}
    </div>
  );
};

export default UsersLabelsOverview;