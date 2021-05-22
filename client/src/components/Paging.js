import { Button } from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

export default function Paging({ paging, onLast }) {
  return <>
    {paging.onChange && <div className={"paging"}>
      <Button disabled={paging.currentIndex === 0}
              onClick={() => paging.onChange(paging.currentIndex - 1)}><KeyboardArrowLeftIcon/>
      </Button>

      <Button disabled>{paging.currentIndex + 1} / {paging.total}</Button>

      {onLast && paging.total === paging.currentIndex + 1 ? onLast : <Button disabled={paging.total === paging.currentIndex + 1}
                                                                             onClick={() => paging.onChange(paging.currentIndex + 1)}><KeyboardArrowRightIcon/></Button>}

    </div>}
  </>;
}