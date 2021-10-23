"use strict";

const express = require(`express`);
const request = require(`supertest`);

const createArticleRoute = require(`./articles`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpResponseCode} = require(`../../constants`);

const mockData = [
  {
    id: `AhX9Xz`,
    title: `Wagon Wheels — и ты победитель!`,
    announce:
      `В серьезных делах следует заботиться не столько о том, чтобы создавать благоприятные возможности, сколько о том, чтобы их не упускать.`,
    fullText:
      `Задача жизни не в том, чтобы быть на стороне большинства, а в том, чтобы жить согласно с внутренним, сознаваемым тобой законом. Достичь успеха помогут ежедневные повторения.`,
    createdDate: 1625432694101,
    category: [
      `За жизнь`,
      `Разное`,
      `Красота и здоровье`,
      `Благотворительность`,
      `Путешествия`,
      `Железо`,
      `Еда`,
      `Деревья`,
      `Без рамки`,
      `Кино`,
      `Музыка`,
      `Книги`,
      `Спорт`,
      `Программирование`,
    ],
    comments: [
      {
        id: `F6a9-V`,
        text: `Планируете записать видосик на эту тему?`,
      },
      {
        id: `BZBpxC`,
        text: `Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`,
      },
      {
        id: `ouU1_A`,
        text: `Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему?`,
      },
      {
        id: `hnJByu`,
        text: `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?`,
      },
      {
        id: `I7LH7O`,
        text: `Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
    ],
  },
  {
    id: `GHT9Zg`,
    title: `Обзор новейшего смартфона`,
    announce:
      `Все животные равны. Но некоторые животные более равны, чем другие. `,
    fullText:
      `Задача жизни не в том, чтобы быть на стороне большинства, а в том, чтобы жить согласно с внутренним, сознаваемым тобой законом.`,
    createdDate: 1625992459601,
    category: [
      `IT`,
      `Еда`,
      `Книги`,
      `Кино`,
      `Благотворительность`,
      `Спорт`,
      `Без рамки`,
      `Программирование`,
    ],
    comments: [
      {
        id: `YW-3Iq`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного... Это где ж такие красоты?`,
      },
    ],
  },
  {
    id: `fd9cIW`,
    title: `Как собрать камни бесконечности`,
    announce: `Первая большая ёлка была установлена только в 1938 году.`,
    fullText:
      `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    createdDate: 1629335266612,
    category: [`Без рамки`, `Красота и здоровье`, `Железо`],
    comments: [
      {
        id: `4wjt4s`,
        text: `Совсем немного... Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        id: `tg7WpV`,
        text: `Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Хочу такую же футболку :-)`,
      },
      {
        id: `SnhQzI`,
        text: `Мне кажется или я уже читал это где-то?`,
      },
    ],
  },
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  app.use(
      `/articles`,
      createArticleRoute(new ArticleService(cloneData), new CommentService())
  );
  return app;
};

describe(`API вернет массив всех статей`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () =>
    expect(response.statusCode).toBe(HttpResponseCode.OK));
  test(`Возврашает 3 статьи`, () => expect(response.body.length).toBe(3));
  test(`id первой статьи - "AhX9Xz"`, () =>
    expect(response.body[0].id).toBe(`AhX9Xz`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/AhX9Xz`);
  });

  test(`Status code 200`, () =>
    expect(response.statusCode).toBe(HttpResponseCode.OK));
  test(`Заголовок статьи "Wagon Wheels — и ты победитель!"`, () =>
    expect(response.body.title).toBe(`Wagon Wheels — и ты победитель!`));
});

describe(`Если данные валидны, то API сохранит новую статью`, () => {
  const newArticle = {
    "category": [`Разное`],
    "announce": `Анонс`,
    "fullText": `много текста`,
    "title": `Самый крутой заголовок в истории`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpResponseCode.CREATED));
  test(`Возвращается новая статья`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Количество статей стало 4`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

describe(`API отказывает в создании новой статьи, если данные невалидны`, () => {
  const newArticle = {
    "category": [`Разное`],
    "announce": `Анонс`,
    "fullText": `много текста`,
    "title": `Самый крутой заголовок в истории`
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badOffer = {...newArticle};
      delete badOffer[key];
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpResponseCode.BAD_REQUEST);
    }
  });
});

describe(`Меняем данные в существующей статье`, () => {
  const newArticle = {
    "category": [`Разное`],
    "announce": `Анонс`,
    "fullText": `много текста`,
    "title": `Самый крутой заголовок в истории`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/fd9cIW`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpResponseCode.OK));
  test(`Возвращает изменную статью`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Проверяем изменения на заголовке статьи`, () => request(app)
    .get(`/articles/fd9cIW`)
    .expect((res) => expect(res.body.title).toBe(`Самый крутой заголовок в истории`))
  );
});

test(`Возвращаем 404 если пытаемся менять несуществующую статью`, () => {
  const app = createAPI();

  const validArticle = {
    "category": [`Разное`],
    "announce": `Анонс`,
    "fullText": `много текста`,
    "title": `Самый крутой заголовок в истории`
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpResponseCode.NOT_FOUND);
});

test(`Возвращаем 400, когда пытаемся изменить статью невалидным запросом`, () => {
  const app = createAPI();

  const invalidArticle = {
    "category": [`Невалид`],
    "announce": `Неликвид`,
    "fullText": `А заголовок где?`
  };

  return request(app)
    .put(`/articles/fd9cIW`)
    .send(invalidArticle)
    .expect(HttpResponseCode.BAD_REQUEST);
});

describe(`Успешное удаление существующей статьи`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/GHT9Zg`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpResponseCode.OK));
  test(`Возвращаем удаленную статью`, () => expect(response.body.id).toBe(`GHT9Zg`));
  test(`Статей теперь 2`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`Ошибка при попытке удаления несуществующей статьи`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpResponseCode.NOT_FOUND);
});

describe(`Возвращаем массив всех комментариев к статье`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
        .get(`/articles/AhX9Xz/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpResponseCode.OK));
  test(`Возвращается массив из 5 комментариев`, () => expect(response.body.length).toBe(5));
  test(`id первого комментария - F6a9-V"`,
      () => expect(response.body[0].id).toBe(`F6a9-V`));
});

describe(`Создаем комментарий, если данные в запросе валидны`, () => {
  const app = createAPI();

  const newComment = {
    text: `Валидный коммент`
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
        .post(`/articles/GHT9Zg/comments`)
        .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpResponseCode.CREATED));
  test(`Изменилось число комментариев к статье`, () => request(app)
      .get(`/articles/GHT9Zg/comments`)
      .expect((res) => expect(res.body.length).toBe(2))
  );
  test(`Возвращается новый комментарий`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
});

test(`Возвращаем 404 если пытаемся создать комментарий к несуществующей статье`, async () => {
  const app = createAPI();

  return request(app)
      .post(`/articles/NOEXST/comments`)
      .send({
        text: `Рыба текст`
      })
      .expect(HttpResponseCode.NOT_FOUND);

});

test(`Код 400 для попытки создать комментарий с невалидными данными`, async () => {
  const invalidComment = {
    noValidProp: `Невалидный объект для создания комментария`
  };

  const app = createAPI();

  return request(app)
      .post(`/articles/GHT9Zg/comments`)
      .send(invalidComment)
      .expect(HttpResponseCode.BAD_REQUEST);
});

describe(`Успешное удаление комментрия`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
        .delete(`/articles/fd9cIW/comments/tg7WpV`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpResponseCode.OK));
  test(`Количество комментов теперь 2`, () => request(app)
      .get(`/articles/fd9cIW/comments`)
      .expect((res) => expect(res.body.length).toBe(2))
  );
  test(`Текст удаленного комментария`, () => expect(response.body.text).toBe(`Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Хочу такую же футболку :-)`));
});

test(`404 при попытке удалить несуществующий комментарий`, async () => {
  const app = createAPI();

  return request(app)
      .delete(`/articles/GHT9Zg/comments/NOEXST`)
      .expect(HttpResponseCode.NOT_FOUND);
});

test(`404 для попытки удаления комментрия у несуществующей статьи`, async () => {
  const app = createAPI();

  return request(app)
      .delete(`/articles/NOEXST/comments/SOMEID`)
      .expect(HttpResponseCode.NOT_FOUND);
});
