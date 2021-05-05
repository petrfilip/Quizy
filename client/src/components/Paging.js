export default function Paging({ paging }) {
  return <>
    {paging.onChange && <div className={"paging"}>
      <button disabled={paging.currentIndex === 0}
              onClick={() => paging.onChange(paging.currentIndex - 1)}>&#10094;
      </button>
      {paging.currentIndex+1} / {paging.total}
      <button disabled={paging.total === paging.currentIndex+1}
              onClick={() => paging.onChange(paging.currentIndex + 1)}>&#10095;</button>
    </div>}
  </>;
}