/** @jsx React.DOM */
var Comment = React.createClass({
  render: function () {
    return (
      <div className="p4 m2 bg-darken-1">
        <h4>
         {this.props.date}
        </h4>
        <h3>
          {this.props.comment}
        </h3>
        <h4 className="right commentAuthor">
          - {this.props.author}
        </h4>
      </div>
      );
  }
});

var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.comments.map(function (comment, index) {
      return (
        <Comment author={comment.author} comment={comment.comment} date={comment.comment_date} key={index} />
      );
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentBox = React.createClass({
  getInitialState: function () {
    return {comments: []};
  },
  componentDidMount: function () {
    this.loadCommentsFromServer();
  },
  loadCommentsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function (comments) {
        this.setState({comments: comments});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.comments;
    var newComments = comments.concat([comment]);
    this.setState({comments: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: {"comment": comment},
      success: function(data) {
        this.loadCommentsFromServer();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    return (
      <div className="commentBox">
        <h1>Say what you need to say</h1>
        <CommentList comments={this.state.comments} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function() {
    var author = this.refs.author.getDOMNode().value.trim();
    var comment = this.refs.comment.getDOMNode().value.trim();
    this.props.onCommentSubmit({author: author, comment: comment});
    this.refs.author.getDOMNode().value = '';
    this.refs.comment.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
      <p>
        <div className="p1 bg-light-gray">
          <h2>Add a comment</h2>

          <form className="commentForm sm-col-6" onSubmit={this.handleSubmit}>
            <input type="text" placeholder="Your name" ref="author" className="block full-width input" />
            <input type="textarea" rows="3" placeholder="Say something..." ref="comment" className="block full-width input" />
            <button className="button-blue" type="submit">Post</button>
          </form>
        </div>
      </p>
    );
  }
});

var ready = function () {
  React.renderComponent(
    <CommentBox url="/comments.json" />,
    document.getElementById('comments')
  );
};

$(document).ready(ready);