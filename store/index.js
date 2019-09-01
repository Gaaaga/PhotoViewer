import { observable, action, computed } from 'mobx';

export const ORDERTYPEP = {
  VA: 'viewsAscending',
  VD: 'viewsDescending',
  DA: 'downloadAescending',
  DD: 'downloadDescending',
};
class Store {
  @observable list = [];

  @observable search = '';

  @observable orderType = ORDERTYPEP.VA;

  @observable cameraMake = [];

  @observable cameraModel = [];

  @action initData(data) {
    this.list = data;
    // this.sortedList = data;
  }

  @action updateSearch(text) {
    this.search = text;
  }

  @action applyFilter(make, model, order) {
    this.cameraMake = make;
    this.cameraModel = model;
    this.orderType = order;
  }

  @computed
  get sortedList() {
    const filter = () => {
      let result = this.list;
      if (this.search) {
        result = this.list.filter(item => {
          return item.user.name
            .toLowerCase()
            .includes(this.search.toLocaleLowerCase());
        });
      }
      if (this.cameraMake.length !== 0) {
        const cameraMakeList = [];
        this.cameraMake.forEach(camera => {
          const res = result.filter(item => {
            return item.exif.make === camera;
          });
          cameraMakeList.push(...res);
        });
        result = cameraMakeList;
      }
      if (this.cameraModel.length !== 0) {
        const cameraModelList = [];
        this.cameraModel.forEach(camera => {
          const res = result.filter(item => {
            return item.exif.model === camera;
          });
          cameraModelList.push(...res);
        });
        result = cameraModelList;
      }
      return result;
    };
    const sortList = (type, list) => {
      const typeToType = {
        [ORDERTYPEP.VA]: 'views',
        [ORDERTYPEP.VD]: 'views',
        [ORDERTYPEP.DA]: 'downloads',
        [ORDERTYPEP.DD]: 'downloads',
      };
      if (list.length > 0) {
        return list.sort((a, b) => {
          if (type === ORDERTYPEP.VA || type === ORDERTYPEP.DA) {
            return a[typeToType[type]] - b[typeToType[type]];
          }
          return b[typeToType[type]] - a[typeToType[type]];
        });
      }
      return list;
    };

    return sortList(this.orderType, filter());
  }
}

const store = new Store();
export default store;
