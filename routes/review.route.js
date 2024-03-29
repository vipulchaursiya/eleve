const express = require('express');
const url = require('url');
const Review = require('../models/review');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

router.post('/getFromLink', async (req, res) => {
  try {
    const { pageLink } = req.body;
    let pagenumber = 0,
      EdpNo;
    if (!pageLink.includes('EdpNo'))
      return res.status(400).json({ message: 'EdpNo should exist in url' });

    const queryData = url.parse(pageLink, true).query;
    if (queryData.EdpNo && queryData.EdpNo.trim().length) {
      EdpNo = queryData.EdpNo;
    } else {
      return res.status(400).json({ message: 'EdpNo should not be empty' });
    }

    queryData.pagenumber ? (pagenumber = queryData.pagenumber) : '';

    // check if this page and edpNm already exists
    const isReviewAlreadyExist = await Review.findOne({ EdpNo: EdpNo, pagenumber: pagenumber });
    if (!isReviewAlreadyExist) {
      let result = await axios.post(pageLink);
      let $ = cheerio.load(result.data);

      // get review body block from the page html
      const reviewBodyBlock = $('div.review');
      const reviewObj = [];

      reviewBodyBlock.each(function () {
        let title = $(this).find('div.rightCol>blockquote>h6').text();
        let description = $(this).find('div.rightCol>blockquote>p').text();
        let ratingArr = $(this).find('div.leftCol>dl.itemReview > dd').text();
        let dateName = $(this).find('div.leftCol>dl.reviewer').text().split('\n');
        if (title.length || description.length) {
          reviewObj.push({
            title,
            description,
            EdpNo,
            pagenumber,
            ratingsDetail: getRatings(ratingArr),
            name: dateName[2].replace(/,/g, ''),
            date: dateName[4] !== ',' ? dateName[4] : '',
          });
        }
      });
      if (reviewObj && reviewObj.length === 0) {
        return res.json({ message: 'No review exist for given EdpNo' });
      }
      await Review.insertMany(reviewObj);
    }

    // find All review for EdpNm
    const result = await Review.find(
      { EdpNo: EdpNo },
      { title: 1, description: 1, _id: 0, ratingsDetail: 1, name: 1, date: 1 }
    )
      .sort({ date: -1 })
      .lean();

    result.forEach((el) => {
      el.date = moment(el.date).format('MMM DD, YYYY');
    });
    return res.json({ data: result });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: 'Internal Server Error, Please try after sometime.' });
  }
});

router.get('/fetchAllReviews', async (req, res) => {
  try {
    let reviews = await Review.find(
      {},
      { title: 1, description: 1, _id: 0, EdpNo: 1, ratingsDetail: 1, name: 1 }
    )
      .sort({ date: -1 })
      .lean();
    reviews.forEach((el) => (el.date = moment(el.date).format('MMM DD, YYYY')));
    return res.json({ data: reviews });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: 'Internal Server Error, Please try after sometime.' });
  }
});

router.get('/getProductReviewByEdp/:id', async (req, res) => {
  try {
    const edpNm = req.params.id;
    let reviews = await Review.find(
      { edpNm: edpNm },
      { title: 1, description: 1, _id: 0, EdpNo: 1, ratingsDetail: 1, name: 1 }
    )
      .sort({ date: -1 })
      .lean();
    reviews.forEach((el) => (el.date = moment(el.date).format('MMM DD, YYYY')));
    return res.json({ data: reviews });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: 'Internal Server Error, Please try after sometime.' });
  }
});

function getRatings(string) {
  let ratings = {};
  const reviewTitleTextArr = ['Overall', 'Value', 'Features', 'Quality', 'Performance'];
  string = string.split('�');
  string[0] = string[0].replace(/\n/g, '');
  for (var i = 0; i < reviewTitleTextArr.length; i++) ratings[reviewTitleTextArr[i]] = string[i];
  return ratings;
}

module.exports = router;
