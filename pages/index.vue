<template>
  <div class="container">
    <div class="head">
      <div class="background" :style="{ backgroundImage: 'url(' + header.img + ')' }"></div>
      <div class="fade">
        <div class="cont">
          <p class="name">{{ header.name }}</p>
          <div class="buttons">
            <button type="button" class="btn play">Play Now</button>
            <button type="button" class="btn list">Watch List</button>
          </div>
        </div>
      </div>

      <div class="header">
        
      </div>
    </div>

    <div class="categories">
      <div v-for="c in categories" class="cat" :style="{ backgroundImage: 'url(' + c.img + ')' }">
        <div class="fade">
          <p>{{ c.name }}</p>
        </div>
      </div>
    </div>

    <div class="t">
      <p class="h">My Movies</p>
      <div class="titles">
        <div v-for="m in movies" class="mov" :style="{ backgroundImage: 'url(' + m.img + ')' }">
          <div class="fade">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/// Standard Vue/Nuxt modules
import Vue from 'vue'
import axios from '~/plugins/axios'

/// Enables the HJSON format parser
var Hjson = require('hjson')

export default Vue.extend({
  data: () => ({
    config: Hjson.parse(require('../fluis.config.hjson').default),
    header: {
      img: "https://www.themoviedb.org/t/p/w1066_and_h600_bestv2/kf456ZqeC45XTvo6W9pW5clYKfQ.jpg",
      name: "Soul"
    },
    categories: [
      {
        name: "animation",
        img: "https://www.themoviedb.org/t/p/original/r39CgvHn1gVEtRGdBdDpC3a6c81.jpg"
      },
      {
        name: "action",
        img: "https://www.themoviedb.org/t/p/original/2nGKhDksmoDdkllXm5D5gy2urCg.jpg"
      },
      {
        name: "sci-fi",
        img: "https://www.themoviedb.org/t/p/original/jn52me8AagfNt7r84SgQbV0R9ZG.jpg"
      },
      {
        name: "fantasy",
        img: "https://www.themoviedb.org/t/p/original/x4NZ2JSb8ojOK0NPOScagYn6sQK.jpg"
      },
      {
        name: "anime",
        img: "https://www.themoviedb.org/t/p/original/kP5duNJEbTfXpBs6CITsaZ88pQi.jpg"
        //img: "https://www.themoviedb.org/t/p/original/5mUYDoFjDlPmDvnUWSknhYjGBBh.jpg"
      }
    ],
    movies: [
      {
        name: "John Wick 2",
        img: "https://www.themoviedb.org/t/p/w440_and_h660_face/hXWBc0ioZP3cN4zCu6SN3YHXZVO.jpg"
      },
      {
        name: "Shrek",
        img: "https://www.themoviedb.org/t/p/w440_and_h660_face/o04jZs5SXhbvhqO4981W7KJXOWZ.jpg"
      },
      {
        name: "The Curious Case of Benjamin Button",
        img: "https://www.themoviedb.org/t/p/w1280/9H2awZmNisMVJGp362Stv0bfUTs.jpg"
      },
      {
        name: "Captain America: The First Avenger",
        img: "https://www.themoviedb.org/t/p/w440_and_h660_face/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg"
      },
      {
        name: "Ratatouille",
        img: "https://www.themoviedb.org/t/p/w440_and_h660_face/1W8FTjVzNskmTJSfA9eufhyhtMB.jpg"
      },
      {
        name: "Spies in Disguise",
        img: "https://www.themoviedb.org/t/p/w440_and_h660_face/30YacPAcxpNemhhwX0PVUl9pVA3.jpg"
      },
      {
        name: "Wonder Woman 1984",
        img: "https://www.themoviedb.org/t/p/w440_and_h660_face/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg"
      },
      {
        name: "Joker",
        img: "https://www.themoviedb.org/t/p/w440_and_h660_face/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"
      },
      {
        name: "The SpongeBob Movie: Sponge on the Run",
        img: "https://www.themoviedb.org/t/p/w440_and_h660_face/j8MRnCjuN7kpM8w3B5hM5mrvTaE.jpg"
      },
      {
        name: "Shazam!",
        img: "https://www.themoviedb.org/t/p/w440_and_h660_face/xoJ2TExRHwrEdcuLglbQskgW5Q9.jpg"
      },
      {
        name: "My Neighbor Totoro",
        img: "https://www.themoviedb.org/t/p/w440_and_h660_face/ykeaF3Ldz1Kf6sfnOJJH4dW56F4.jpg"
      }
    ]
  }),
  mounted() {
    axios({
      method: 'get',
      url: "v"
    })
    .then( (r) => {
      //alert(r.data);
    })
    .catch( (error) => {
      alert(error);
    })
  }
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;

  //background-color: black;

  .btn {
    border-radius: 20px;
    border: none;
    outline: none;

    padding: 10px 15px;

    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    text-transform: uppercase;
  }

  $margin: 20px;
  $headHeight: 60vh;
  .head {
    width: 100vw;
    height: $headHeight;

    position: absolute;

    .header {
      width: 100%;
      height: 50px;

      position: absolute;
      top: 0;
      left: 0;

      //background-color: yellow;
    }

    .fade {
      width: calc(100% - (2 * #{$margin}));
      height: calc(100% - #{$margin} - 10px);

      position: absolute;
      top: $margin;
      left: $margin;

      background-image:  linear-gradient(rgba(0,0,0, 0) 0%,rgba(0,0,0, 1) 100%);

      .cont {
        width: 30%;

        position: relative;
        left: 0;
        top: calc(50% - ((#{$headHeight} - 50vh) / 2));
        transform: translateY(-50%);

        margin-left: calc(#{$margin} * 2);
        
        .name {
          text-align: left;
          font-size: 5vw;
          font-family: Arial, Helvetica, sans-serif;
          //font-weight: bold;
          text-transform: uppercase;

          color: white;

          margin-bottom: 5px;;
        }

        .buttons {
          display: inline-block;

          .play {
            background-color: purple;
            color: white;
          }
          .play:hover {
            background-color: rgba($color: white, $alpha: 0.0);
            border: purple solid 2px;
            padding: 8px 13px;
            cursor: pointer;
          }

          .list {
            background-color: white;
            color: black;
          }
          .list:hover {
            background-color: rgba($color: white, $alpha: 0.0);
            border: white solid 2px;
            color: white;
            padding: 8px 13px;
            cursor: pointer;
          }
        }
      }
    }
    .background {
      width: calc(100% - (2 * #{$margin}));
      height: calc(100% - #{$margin} - 10px);

      border-radius: 20px;

      position: absolute;
      top: $margin;
      left: $margin;

      background-size: cover;
      background-repeat: no-repeat;
      background-position: center top;

      filter: blur(4px);
    }
  }

  $categoriesHeight: 30vh;
  .categories {
    width: 100%;
    height: $categoriesHeight;

    position: absolute;
    left: 0;
    top: 50%;

    padding-left: $margin;

    overflow-y: hidden;
    overflow-x: auto;
    white-space: nowrap;

    .cat {
      width: 30vw;
      height: 100%;

      display: inline-block;
      transform: scale(0.95);

      border-radius: 20px;
      cursor: pointer;

      background-size: cover;
      background-repeat: no-repeat;
      background-position: center top;

      margin-right: 20px;

      .fade {
        width: 100%;
        height: 100%;

        background-image:  linear-gradient(rgba(0,0,0, 0) 0%,rgba(0,0,0, 0.95) 100%);

        p {
          position: relative;
          top: 50%;
          transform: translateY(-50%);

          text-align: center;
          font-size: 300%;
          font-family: Arial, Helvetica, sans-serif;
          text-transform: capitalize;

          color: white;
        }
      }
    }
    .cat:hover, .cat:focus {
      transform: scale(1);
    }
  }

  .t {
    width: 100%;
    position: relative;
    left: 0;
    top: calc(50vh + #{$categoriesHeight} + 20px);
    //top: calc(50% + 20px + #{$categoriesHeight});

    padding-left: $margin;

    .h {
      text-align: left;
      font-size: 300%;
      font-family: Arial, Helvetica, sans-serif;
      text-transform: capitalize;
      color: white;

      margin-bottom: 5px;
    }

    .titles {
      width: 100%;

      overflow-y: hidden;
      overflow-x: auto;
      white-space: nowrap;

      margin-bottom: 20px;

      $movSpace: 20px;
      $movWidth: calc(15vw - (#{$movSpace} / 2));
      .mov {
        width: $movWidth;
        height: calc(#{$movWidth} * (16/9));

        display: inline-block;
        transform: scale(0.95);

        border-radius: 20px;
        cursor: pointer;

        background-size: cover;
        background-repeat: no-repeat;
        background-position: center top;

        margin-right: $movSpace;
      }
      .mov:hover, .mov:focus {
        transform: scale(1);
      }
    }
  }
}
</style>
