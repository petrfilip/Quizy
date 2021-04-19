# Quizy app

Free to use application for making quizzes.

The frontend is made in React. For development go to `quizy-frontend`, run `npm install` and `npm start`

The backend is made in PHP (with Slim framework). To run the backend is possible with command
`php -S localhost:8888 -t api/public/`

---

Endpoints:

- GET /quiz - find all
- GET /quiz/{slug} - find by slug
- POST /quiz - insert or update quiz

---

Quiz schema:

```json
{
  "slug": "react-quiz",
  "title": "React Quiz",
  "description": "Some basics about React",
  "heroImage": "https://host/path/to/image.jpg",
  "questions": [ // list of questions
    {
      "id": 5, // unique question identifier - will be generated automatically
      "type": "pickOne", // component type
      "question": "Your question", //question
      "answers": [
        {
          "id": 0, // answer unique identifier - will be generated automatically
          "text": "useEffect", // text of the answer
          "comment": "This is not good because...." // comment which will shown when question answered
        },
        ... //more answers
      ],
      "correct": 5, // reference to question.[i].id
      "comment": "Použije se useEffect" // comment which will shown when question answered
      "params": {
        ... //custom params related to questions.[i].type parameter
      }
    }
  ],
  ... // more questions
}
```
