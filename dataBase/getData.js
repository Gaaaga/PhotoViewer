const Unsplash = require('unsplash-js').default;
const fetch = require('node-fetch');
const fs = require('fs');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

global.fetch = fetch;
//
// const unsplash_1 = new Unsplash({
//   applicationId:
//     'd44f0a82cd79954d00ecc62c38972d4b00baf231a37f15fdf8737a6a21d34002',
//   secret: '98ddad2f2dd6214377e600d2a7cec0c7e2c2b116628e59e9908cdbb4d2bf0e3e',
//   callbackUrl: 'urn:ietf:wg:oauth:2.0:oob',
// });
// const unsplash_2 = new Unsplash({
//   applicationId:
//     'd8a2f9456f7177a8ae989e68c204a35b7373150e28b8a731ec98ca0acd5138e0',
//   secret: '4926b5ce071c54803ccb25adf05b7a23fb8ab677baa2072a1d146800258b42aa',
//   callbackUrl: 'urn:ietf:wg:oauth:2.0:oob',
// });

const unsplash = new Unsplash({
  applicationId:
    'efe42a3c93d7d60f4db2d09b23e63862003482da22c38b355f07068cffe2aee8',
  secret: 'ed64cc259bcaa560eb802c7ff27d02df26fcc3419d8fc7f33a390395d75c21cf',
  callbackUrl: 'urn:ietf:wg:oauth:2.0:oob',
});

const storeData = data => {
  try {
    fs.writeFileSync('./index.json', JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const dataBase = [];

const getItem = (item, cb) => {
  unsplash.photos
    .getPhoto(item.id)
    .then(response => response.json())
    .then(detailResult => {
      const composedItem = item;
      composedItem.detailInfo = detailResult;
      dataBase.push(detailResult);
      cb();
    })
    .catch(() => {
      console.log('reject item');
      cb();
    });
};

const imageList = [];

const getList = (page, cb) => {
  unsplash.collections
    .getCollectionPhotos(1139926, page, 10)
    .then(response => response.json())
    .then(list => {
      imageList.push(...list);
      cb();
    })
    .catch(() => {
      console.log('reject list');
      cb();
    });
};

const asyncList = (asyncFunc, list) => {
  return list.map(item => {
    return new Promise(resolve => {
      asyncFunc(item, resolve);
    });
  });
};

const pageList = [];
let page = 1;
while (page <= 10) {
  pageList.push(page);
  page += 1;
}
Promise.all(asyncList(getList, pageList)).then(() => {
  Promise.all(asyncList(getItem, imageList)).then(() => {
    console.log('done with item');
    storeData(dataBase);
  });
});
