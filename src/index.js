import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './CommentBox';
import SignUpForm from './SignUpForm';

//more React code here!

ReactDOM.render(
  <div>
  <CommentBox url = 'http://localhost:3001/api/comments'
  pollInterval={2000}/>
  <SignUpForm/>
  </div>,
  document.getElementById('root')
);
