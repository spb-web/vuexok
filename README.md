# Vuexok

vuexok маленький пакет для больших проектов. 

Vuexok не заменяет api vuex, а расширяет его, добавляя поддержку типов typescript и дает возможность использовать экшены и мутации без явного использования [commit](https://vuex.vuejs.org/guide/mutations.html) и [dispatch](https://vuex.vuejs.org/guide/actions.html#dispatching-actions) .
По этому миграция в большенстве случает пройдет быстро и безболезненно

## Документация
[https://spb-web.github.io/vuexok/](https://spb-web.github.io/vuexok/)

Будет здорово если придут пулреквесты с дополнениями к документации и с переводами

## Установка
### NMP
```
npm install vuexok --save
```

### Yarn
```
yarn add vuexok
```

## Что даст vuexok
- Больше не нужный константы для экшенов и мутаций
- Полная поддержка typescript
- Простая миграция с vuex. Вам не придется всё переписывать.
- Совместимо с vuex 4 и vue 3
- Маленький размер vuexok. Всего 532B (322B gzip) за простоту в работе с хранилищем
