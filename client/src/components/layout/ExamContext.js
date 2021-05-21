import { createContext, useState } from "react";

const ExamContext = createContext();

function ExamProvider({ children }) {

  const [exam, setExam] = useState();

  const values = {
    exam,
    setExam
  }

  return (
    <ExamContext.Provider value={values}>
      {children}
    </ExamContext.Provider>
  );
}

export { ExamProvider, ExamContext }