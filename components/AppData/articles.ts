const ARTICLE_DATA = [
  {
    title: 'Understanding and fixing N+1 query in Ruby on Rails',
    type: ['article'],
    text: 'Regarding backend performance, there is a performance issue that everybody has heard about at least once: N+1 query. The N+1 query problem happens when your code executes N additional query statements to fetch the same data that could have been retrieved when executing the primary query. When it comes to understanding and fixing N+1 queries in the context of Ruby on Rails, it refers to the process of identifying and resolving a common performance issue in database queries. An N+1 query occurs when a database query is made within a loop, resulting in N+1 individual queries being executed. This can lead to inefficient database access and slow down the application`s performance. In the context of Ruby on Rails, this issue can be addressed by using techniques such as eager loading, which allows related data to be loaded in advance, reducing the number of database queries. Additionally, caching and optimizing database indexes can also help improve query performance. To fix N+1 queries in Ruby on Rails, developers can use tools like ActiveRecord`s includes method to preload associations and minimize the number of database queries. They can also use tools like Bullet gem to detect and address N+1 query issues. Let`s say we have a blog application with two models: Post and Comment. Each post has multiple comments associated with it. Now, suppose we want to display a list of posts along with the number of comments for each post.'
  },
];

export default ARTICLE_DATA;
