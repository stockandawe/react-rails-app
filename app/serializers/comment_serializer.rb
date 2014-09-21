class CommentSerializer < ActiveModel::Serializer
  attributes :id, :comment, :author, :comment_date

  def comment_date
    object.created_at.strftime('%A, %d %b %Y %l:%M %p')
  end
end
