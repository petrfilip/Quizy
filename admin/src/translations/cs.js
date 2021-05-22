const cs = {
  translation: {
    navbar_dashboard: "Úvod",
    navbar_lessons: "Lekce",
    navbar_results: "Výsledky",
    navbar_users: "Uživatele",
    navbar_fileManager: "Soubory",
    title_lesson: "Lekce",
    navbar_courses: "Kurzy",
    navbar_login: "Přihlásit",
    title_allLessons: "Všechny lekce",
    title_allCourses: "Všechny kurzy",
    title_flashcards: "Kartičky",
    button_addFlashcard: "Přidat kartičku",
    title_flashcardsTitle: "Název kartičky",
    title_quiz: "Kvíz",
    title_exam: "Zkouška",
    button_moveToQuiz: "Přejít na kvíz",
    button_moveToExam: "Přejít na zkoušku",
    title_doYouKnow: "Znáš správnou odpověd?",
    title_selectOneOption: "Vyber správnou odpověď",
    title_selectMultipleOptions: "Vyber správné odpovědi",
    title_fillFieldsExactly: "Vyplň přesně chybějící výrazy",
    button_done: "Hotovo",
    button_correct: "Správně",
    button_incorrect: "Chyba",
    button_startExam: "Spustit zkouškový test",
    title_minimalScore: "Minimální skóre",
    title_countOfQuestions: "Počet otázek",
    title_repeatable: "Lze opakovat",
    title_examResult: "Výsledek testu",
    button_goToProfile: "Přejít na profil",
    edit: "Upravit",
    delete: "Smazat",
    detail: "Detail",
    yes: "ano",
    no: "no",
    search: "vyhledat",
    noItemCorrespondToCriteria: "Zadaným kritériím nevyhovuje žádný záznam",
    title_profile: "Profil",

    //lesson item manager
    lim_main: "Hlavní nastavení",
    lim_flashcards: "Kartičky",
    lim_newPrefix: "Nová otázka",
    lim_persistLesson: "Uložit lekci",
    lim_addNewQuestion: "Přidat otázku",
    lim_addDeleteQuestion: "Smazat otázku",
    lim_unsavedWarning: "Lekce nebyla uložena. Chcete stránku opustit bez uložení lekce?",

    // quiz item main
    qim_titleLessonInfo: "Nastavení lekce",
    qim_formTitle: "Název lekce",
    qim_formDescription: "Popisek lekce",
    qim_formHeroImage: "Úvodní obrázek",
    qim_formTitleExamParameters: "Úvodní obrázek",
    qim_formMinimalScoreTitle: "Minimální skóre",
    qim_formMinimalScoreDescription: "Minimální % skóre pro úspěšné splnění",
    qim_formQuestionsInExamTitle: "Počet otázek v testu",
    qim_formQuestionsInExamDescription: "Kolik otázek bude v testu generováno",
    qim_formRepeatableTitle: "Opakovatelný?",
    qim_formRepeatableDescription: "Může být test spuštěn opakovaně?",

    // quiz question editor
    qqe_questionType: "Typ odpovědi",
    qqe_pickOne: "Vybrat jednu",
    qqe_pickMultiple: "Vybrat více",
    qqe_pickFillTextExactly: "Přesně vyplnit do textu",
    qqe_answerType: "Typ otázky",
    qqe_simpleInput: "Jednoduchý text",
    qqe_markdown: "Markdown",

    qe_addAnotherAnswer: "Přidat další odpoveď",
    qe_addReason: "Přidat odůvodnění",
    qe_editReason: "Upravit odůvodnění",
    qe_hideReason: "Skrýt odůvodnění",

    qe_showPreview: "Náhled na doplněný text",
    qe_templates: "Šablony",

    qe_template_1_title: "Doplňovačka",
    qe_template_1_content: "${název} (${výška} m n. m.) je nejvyšší hora v ${pohoří} a v České republice",

    qe_template_2_title: "Kód",
    qe_template_2_content: "   \n"
      + "```java\n"
      + "    @${1}\n"
      + "    @Table(name = \"cities\")\n"
      + "    public class City {\n"
      + "\n"
      + "      @${2}\n"
      + "      @GeneratedValue(strategy = GenerationType.IDENTITY)\n"
      + "      private Long id;\n"
      + "\n"
      + "      private String name;\n"
      + "      private int population;\n"
      + "```\n",

    // lesson manager
    lm_addNewLesson: "Přidat novou lekci",
    cm_addNewCourse: "Přidat nový kurz",
    cm_addNewUsers: "Přidat nové uživatele",
    cm_userName: "Jméno uživatele",
    cm_userMail: "Email uživatele",
    cm_userLabels: "Přidat štítek uživatele",
    cm_userDropImport: "Importovat ze souboru (csv / excel se jménem a emailem uživatele)",
    cm_userCreateButton: "Vytvořit uživatele",
    cm_userList: "Seznam uživatelů",


  }
};

export default cs;