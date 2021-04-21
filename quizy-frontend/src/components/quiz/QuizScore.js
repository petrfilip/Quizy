export default function QuizScore({score, total}) {

  return <meter min={0}
                max={total}
                value={score}

                low={total/3} high={total/2} optimum={total/1}

  />
}