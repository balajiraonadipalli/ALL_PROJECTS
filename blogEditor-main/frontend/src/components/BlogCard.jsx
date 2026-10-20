import styles from '../styles/BlogCard.module.css'; // Assuming you have a CSS module for styling

const BlogCard = ({ blog }) => {
  return (
    <div className={styles.blogCard}>
      <h3>{blog.title}</h3>
      <p>{blog.content}</p>
      <p>
        {Array.isArray(blog.tags) &&
          blog.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
            </span>
          ))}
      </p>
    </div>
  );
};

export default BlogCard;