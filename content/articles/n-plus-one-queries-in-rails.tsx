import {
  CodeBlock,
  CodeCompare,
  CodeSingle,
  Cm,
  Kw,
} from '@/components/code';
import styles from '@/components/prose.module.css';

export default function Article() {
  return (
    <div className={styles.prose}>
      <p>
        When it comes to backend performance, there is one problem everybody has
        heard of at least once: the N+1 query. It is easy to write by accident,
        invisible in development with ten rows in the database, and brutal at a
        thousand.
      </p>

      <p>
        <strong>
          An N+1 query happens when your code runs N additional statements to
          fetch data the first query could have brought back on its own.
        </strong>{' '}
        One query for the list, then one more for every item in it.
      </p>

      <h2 id="what-it-means">What N+1 actually means</h2>

      <p>
        The name is literal. The <code>1</code> is the query that loads your
        collection. The <code>N</code> is the queries you then fire, one per
        record, because you asked each record for something it did not already
        have in memory. An ORM makes this comfortable to write, which is exactly
        why it happens — nothing in the code looks like a database call.
      </p>

      <h2 id="the-grocery-run">The grocery run</h2>

      <p>
        Imagine cooking a meal and forgetting an ingredient. You drive back to
        the shop. Then you notice another one missing, so you drive back again.
        Each trip is short and each trip feels reasonable, but you have now spent
        an hour on what should have been one list and one journey.
      </p>

      <p className={styles.pull}>
        The fix is not to drive faster. It is to write the list down before you
        leave.
      </p>

      <p>
        Eager loading is the list. You tell ActiveRecord up front what you are
        going to need, and it fetches all of it in one or two queries instead of
        discovering the requirement fifteen times.
      </p>

      <h2 id="in-code">What it looks like in code</h2>

      <p>
        Take a blog with two models. A <code>Post</code> has many{' '}
        <code>Comment</code>s, and the index page shows each post with a count of
        its comments.
      </p>

      <CodeCompare>
        <CodeBlock label="N+1 — one query per post" cost="15 queries" tone="bad">
          {`@posts = Post.`}
          <Kw>all</Kw>
          {`

@posts.`}
          <Kw>each do</Kw>
          {` |post|
  post.title
  post.comments.`}
          <Kw>count</Kw>
          {`
`}
          <Kw>end</Kw>
          {`

`}
          <Cm>{`# SELECT * FROM posts
# SELECT COUNT(*) ... post_id = 1
# SELECT COUNT(*) ... post_id = 2
# ...and so on, forever`}</Cm>
        </CodeBlock>

        <CodeBlock label="Eager loaded" cost="2 queries" tone="good">
          {`@posts = Post.`}
          <Kw>includes</Kw>
          {`(:comments)

@posts.`}
          <Kw>each do</Kw>
          {` |post|
  post.title
  post.comments.`}
          <Kw>size</Kw>
          {`
`}
          <Kw>end</Kw>
          {`

`}
          <Cm>{`# SELECT * FROM posts
# SELECT * FROM comments
#   WHERE post_id IN (1,2,3,...)`}</Cm>
        </CodeBlock>
      </CodeCompare>

      <p>
        Two things changed. <code>includes</code> tells ActiveRecord to load the
        comments alongside the posts, and <code>count</code> became{' '}
        <code>size</code>. That second change matters more than it looks:{' '}
        <code>count</code> always issues a <code>COUNT</code> query, even when
        the records are already loaded. <code>size</code> uses what is in memory
        if it can, and only queries when it cannot.
      </p>

      <h2 id="spotting-it">Spotting it before production does</h2>

      <p>
        You do not have to find these by reading. The{' '}
        <a
          href="https://github.com/flyerhzm/bullet"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bullet
        </a>{' '}
        gem watches your queries in development and tells you where you should
        have eager loaded — and, usefully, where you eager loaded something you
        never used.
      </p>

      <CodeSingle>
        <CodeBlock label="Gemfile — development and test only">
          <Kw>group</Kw>
          {` :development, :test `}
          <Kw>do</Kw>
          {`
  `}
          <Kw>gem</Kw>
          {` 'bullet'
`}
          <Kw>end</Kw>
          {`

`}
          <Cm>{`# config/environments/development.rb
# Bullet.enable = true
# Bullet.bullet_logger = true
# Bullet.raise = true  # fail the test suite instead of warning`}</Cm>
        </CodeBlock>
      </CodeSingle>

      <p>
        Setting <code>Bullet.raise</code> in the test environment is the part
        worth doing. A warning in a log scrolls past; a failing test does not.
      </p>

      <h2 id="the-three-methods">includes, preload, eager_load</h2>

      <p>
        Rails gives you three, and they are not interchangeable:
      </p>

      <ul>
        <li>
          <code>preload</code> always uses a separate query per association. Two
          queries, no join, and you cannot reference the association in a{' '}
          <code>where</code>.
        </li>
        <li>
          <code>eager_load</code> always uses a single <code>LEFT OUTER JOIN</code>
          . One query, and you can filter on the association.
        </li>
        <li>
          <code>includes</code> picks one of the two for you, and switches to the
          join if it sees you referencing the association. This is the one to
          reach for by default.
        </li>
      </ul>

      <p>
        The exception: if you are filtering on the association, say so
        explicitly. <code>includes(:comments).where(comments: {'{'} spam: false{' '}
        {'}'})</code> works, but{' '}
        <code>includes(:comments).references(:comments)</code> tells Rails what
        you meant rather than leaving it to infer.
      </p>

      <p>
        And when eager loading is not enough, the problem is usually one layer
        down: a missing index on the foreign key. Eager loading turns fifteen
        queries into two, but a <code>comments.post_id</code> with no index makes
        both of them slow.
      </p>
    </div>
  );
}
