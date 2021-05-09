# Quizy app

**IN DEVELOPMENT!!!**

Free to use application for making quizzes. 
It is self-hosted solution based on simple tech stack.

Modules
- _admin_ - GUI module for managing quizzes
- _api_ - API module which holds data (data are kept in flat files SleekDB)
- _client_ - GUI modules for user

The frontend is made in React. 
For development go to `client` or `admin`, run `npm install` and `npm start`.

The backend is made in PHP (with Slim framework). To run the backend is possible with command
`php -S localhost:8888 -t api/public/`

---

Whole application is composed of the following objects:
- lesson - contains study materials and quiz questions 
- course - which wraps more lessons
- user - information about users completed lessons and courses
- improvements - user can post issue or improvements

---
## Schemas:

### Lesson schema:

```json
{
  "_id": "...", // generated by database
  "slug": "react-quiz",
  "title": "React Quiz",
  "description": "Some basics about React",
  "heroImage": "https://host/path/to/image.jpg",
  "sys": {
    
  },
  "questions": [ // list of questions
    {
      "id": "607de346747b5", // unique question identifier - will be generated automatically
      "questionType": "pickOne", // component type (pickOne, pickOneSourceCode, sequence, pickMultiple)
      "answerType": "simpleInput", // component for rendering of answers (simpleInput, sourceCode, markdown)
      "question": "Your question", //question
      "probability": "",
      "answers": [
        {
          "text": "useEffect", // text of the answer
          "comment": "This is not good because...." // comment which will shown when question answered
        },
        ... //more answers
      ],
      "correct": 5, // index of correct answer in question.[i].answer.[j] -- differ for each type
      "comment": "Použije se useEffect" // comment which will shown when question answered
      "parameters": {
        ... //custom params related to questions.[i].type parameter
        // example: layout: "2" is used for pickOne
      }
    }
  ],
  ... // more questions
}
```

### Course schema:

```json
{
  "_id": "...", // generated by database
  "slug": "react-quiz",
  "title": "React Quiz",
  "description": "Some basics about React",
  "heroImage": "https://host/path/to/image.jpg",
  "lessonList": [ // list of lessons
    "lessonId-123", // lesson id
    "anotherLessonId-456" // lesson id
  ],
  ...
}
```


### User schema:

```json
{
  "_id": "...", // user id generated by database
  "role": "",
  "mail": "user@mail.cz", // user mail
  "password": "...", //bcrypted password
  "achievementList": { // list of questions
    "lessonList": [
      {
        "lessonId": "...",
        "score": "",
        "doneInTime": "...",
        "completionDate": "...",
        "trying": "..." // how many times it was done
      },...
    ],
    "courseList": [
      {
        "courseId": "...", // reference to course
        "enrolledAt": "...",
        "grade": "",
        "score": "",
        "doneInTime": "...",
        "finishedAt": "...",
        "trying": "..." // how many times it was done
      },...
    ]
  }
    
    ...
  }
}
```

### Improvement schema:

```json
{
  "_id": "...", // user id generated by database
  "mail": "user@mail.cz", // user mail
  "password": "...", //bcrypted password
  "timestamp": "...",
  "message": "...",
  "related": {...}// question or course information
}
```

---

## API Endpoints:

### Lessons
- GET /lessons - find all
- GET /lessons/{slug-lesson} - find by slug
- POST /lessons - insert or update lesson

### Courses

- GET /courses - find all
- GET /courses/{slug-course} - find by slug
- POST /courses - insert or update course

### Exams

- GET /exams/{slug-course}/{slug-lesson} - generate questions (each user get unique set of questions)
- GET /exams/{slug-course}/final - generate a final exam from all questions in course
- POST /exams/{slug-course}/{slug-lesson} - evaluate results and pass the record to the user's completed lessons

### Improvements

- GET /improvements - get improvements (with filters)
- POST /improvements - save improvement

### Users

- GET /users - find all
- GET /users/{id} - find by slug
- POST /users - insert or update user

