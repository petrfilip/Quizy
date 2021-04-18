export default function Paging({ paging }) {
  debugger;
  return <>
    {paging.onChange && <div className={"paging"}>
      <button disabled={paging.currentIndex === 0} onClick={() => paging.onChange(paging.currentIndex - 1)}>Back</button>
      <button disabled={paging.total === paging.currentIndex+1} onClick={() => paging.onChange(paging.currentIndex + 1)}>Next</button>
    </div>}
  </>;
}