import React from "react";

const MockEditDeletAction = ({ type, itemId }: { type: string; itemId: string }) => {
  return (
    <div>
      <button>Edit {type}</button>
      <button>Delete {type}</button>
    </div>
  );
};

export { MockEditDeletAction };
