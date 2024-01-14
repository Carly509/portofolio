/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useContext } from 'react';

/* -------------------------- Internal Dependencies ------------------------- */
import Layout, { PageWrapper } from '../components/Layout';
import Tabs, { TabItems } from '../components/Tabs';
import MansoryLayout from '../components/Mansory';
import MansoryItem from '../components/Mansory/mansory-item';
import { ArticleContext } from '../components/Utils/context';
import { PageSection } from './projects';

const Articles = () => {
  const articles = useContext(ArticleContext);
  return (
    <Layout title="Articles">
      <PageSection>
        <PageWrapper>
          <h1 className="intro__text">Reads.</h1> <br />
          <Tabs>
  <TabItems label="Articles">
  {/* {articles.map((item, index) => {
    if (item.type.includes('article')) {
      return (
        <div key={index}>
          <h1>{item.title}</h1>
          <p>{item.text}</p>
        </div>
      );
    } else {
      return null;
    }
  })} */}
  <h1>Understanding and fixing N+1 query in Ruby on Rails</h1>
  <br/>
  <p>Regarding backend performance, there is a performance issue that everybody has heard about at least once: N+1 query. </p>
  <p> <strong>An N+1 query problem happens when your code executes N additional query statements to fetch the same data that could have been retrieved when executing the primary query.</strong> When it comes to understanding and fixing N+1 queries in the context of Ruby on Rails, it refers to the process of identifying and resolving a common performance issue in database queries</p>
  <p>Let's start with an analogy first</p>
  <p>Imagine you're preparing a meal and forget the buy all the ingredients. Now you have to go back to the groceries store to get them and everytime you forget one you have to make repeated trips ther (multiple feching). this is similar to the N+1 query problem in programming. When using an ORM (Object-Relational Mapping) framework, your code may inadvertently cause the ORM to execute N additional queries after the initial query, resulting in inefficient database access.</p>
  <p>This issue can be addressed by using techniques such as eager loading, which allows related data to be loaded in advance, reducing the number of database queries. Additionally, caching and optimizing database indexes can also help improve query performance. Tools like ActiveRecord's includes method can preload associations and minimize the number of database queries. you can also use tools like Bullet gem to detect and address N+1 query issues.</p>
  <p>Let's say we have a blog application with two models: Post and Comment. Each post has multiple comments associated with it. Now, suppose we want to display a list of posts along with the number of comments for each post.</p>
  <h5>Examples of N+1 Query </h5>
  <p>Bad Implementation:</p>
  <img src="img/img1.png" alt="bad implementation"  style={{ width: '500px', height: 'auto' }}/>
  <p>In this example, for each post, a separate query is made to fetch the comments associated with that post. This leads to N+1 queries, where N is the number of posts. As the number of posts grows, the number of database queries also grows, leading to performance issues.</p>
  <p>Correct Implementation:</p>
  <img src="img/img2.png" alt="bad implementation" style={{ width: '500px', height: 'auto' }}/>
  <p>In the good implementation, we use the includes method to eager load the comments associated with each post. This results in a single query to fetch all the posts and their associated comments, improving performance by reducing the number of database queries.</p>
  <p>By using the includes method, we can optimize the database access and avoid N+1 query issues in our Ruby on Rails application.</p>
</TabItems>
            {/* <TabItems label="Readings">
              <MansoryLayout>
                {articles.map(
                  (item, index) =>
                    item.type.includes('reading') && (
                      <MansoryItem key={index} item={item} />
                    )
                )}
              </MansoryLayout>
            </TabItems> */}
          </Tabs>
        </PageWrapper>
      </PageSection>
    </Layout>
  );
};

export default Articles;
