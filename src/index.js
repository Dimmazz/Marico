import * as $ from 'jquery'
import Post from '@models/Post'
import webpackLogo from './assets/webpack-logo'
import './babel'
// import json from './assets/json.json'
// import xml from './assets/data.xml'
// import csv from './assets/data.csv'
import './styles/styles'
import './styles/less.less'
import './styles/scss.scss'

const post = new Post('Webpack post Title', webpackLogo)

$('pre').addClass('code').html(post.toString())

// console.log('JSON:', json);
// console.log('XML:', xml);
// console.log('CSV:', csv);