import axios from 'axios';

export default class PhotosService {
  constructor() {
    this._query = '';
    this.page = 1;
  }

  async fetchPhotos() {
    const baseUrl = 'https://pixabay.com/api/';
    const options = {
      params: {
        key: '34287533-73b6140ff373420767809a55e',
        q: this._query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: this.page,
      },
    };

    const response = await axios.get(`${baseUrl}`, options);
    this.page += 1;

    return response.data.hits;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this._query;
  }

  set query(newQuery) {
    this._query = newQuery;
  }
}
