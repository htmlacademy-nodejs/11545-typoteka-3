"use strict";

const express = require(`express`);
const request = require(`supertest`);

const createCategoriesRoute = require(`./categories`);
const CategoryService = require(`../data-service/category`);
const {HttpResponseCode} = require(`../../constants`);

const mockData = [
  {
    id: `8efupU`,
    title: `10 упражнений, которые сделают вас атлетом за 3 месяца`,
    announce:
      `Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. `,
    fullText:
      `У самого злого человека расцветает лицо, когда ему говорят, что его любят. Стало быть, в этом счастье... `,
    createdDate: 1629629639349,
    category: [`Еда`, `За жизнь`],
    comments: [
      {
        id: `HIhf4n`,
        text: `Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
    ],
  },
  {
    id: `EhREEp`,
    title: `Что такое золотое сечение`,
    announce:
      `Книги, которые мир считает аморальными, - это книги, которые демонстрируют миру его позор. `,
    fullText:
      `Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    createdDate: 1629175261975,
    category: [`Железо`, `Программирование`],
    comments: [
      {
        id: `XiEhAk`,
        text: `Хочу такую же футболку :-)`,
      },
      {
        id: `h_ocMX`,
        text: `Это где ж такие красоты?`,
      },
    ],
  },
  {
    id: `P4OTKT`,
    title: `Будущее близко: стираем языковые границы`,
    announce:
      `У самого злого человека расцветает лицо, когда ему говорят, что его любят. Стало быть, в этом счастье... Игры и программирование разные вещи.`,
    fullText:
      `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года.`,
    createdDate: 1630080620264,
    category: [`IT`, `Программирование`],
    comments: [
      {
        id: `6IplBZ`,
        text: `Хочу такую же футболку :-) Согласен с автором!`,
      },
    ],
  },
];

const app = express();
app.use(express.json());
app.use(`/categories`, createCategoriesRoute(new CategoryService(mockData)));

describe(`Вернуть список категорий`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () =>
    expect(response.statusCode).toBe(HttpResponseCode.OK));
  test(`Возвращает список из 5 категорий`, () =>
    expect(response.body.length).toBe(5));

  test(`В список входыт "Еда", "За жизнь", "Железо", "IT", "Программирование"`, () =>
    expect(response.body).toEqual(
        expect.arrayContaining([
          `Еда`,
          `За жизнь`,
          `Железо`,
          `IT`,
          `Программирование`,
        ])
    ));
});
