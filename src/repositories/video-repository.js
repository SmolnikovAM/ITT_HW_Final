const db = require('../config/db');

const query = {
  findByTag(tag) {
    return db.getMultipleResult(
      'SELECT * FROM videos AS v WHERE v.tag = ? AND v.visibility = ? AND v.status IS NOT ? LIMIT 8',
      [tag, 'public', 'blocked'],
    );
  },
  updateVideo(name, about, tag, visibility, status, likes, dislikesCount, videoId) {
    return db.updateObj(
      'UPDATE videos SET ' +
      'name = ?, about = ?, tag = ?, ' +
      'visibility = ?, status = ?, likes_count = ?, ' +
      'dislikes_count = ? ' +
      'WHERE id = ? ',
      [name, about, tag, visibility, status, likes, dislikesCount, videoId],
    );
  },
  getVideoById(id) {
    return db.getSingleResult('SELECT * FROM videos AS v WHERE v.id = ?', id);
  },
  increaseCounter(videoId, playCount) {
    return db.updateObj('UPDATE videos SET play_count = ? WHERE id = ?', [
      playCount,
      videoId,
    ]);
  },
  findByUUID(uuid) {
    return db.getSingleResult(
      "SELECT * FROM videos AS v WHERE v.uuid = ? AND v.status IS NOT 'blocked'",
      uuid,
    );
  },
  saveVideo(videoObj) {
    return db.insertObj(
      'INSERT INTO videos(name, about, image, visibility, ' +
                          'post_date, tag, uuid, user_id, ' +
                          'low_quality, high_quality, status, duration) ' +
        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        videoObj.name,
        videoObj.about,
        videoObj.image,
        videoObj.visibility,
        videoObj.postDate,
        videoObj.tag,
        videoObj.uuid,
        videoObj.userId,
        videoObj.low,
        videoObj.high,
        videoObj.status,
        videoObj.duration
      ],
    );
  },
  deleteVideo(uuid, userId) {
    return db.deleteObj(
      "DELETE FROM videos WHERE uuid = ? AND user_id = ? " +
      "OR (SELECT u.role FROM users as u WHERE u.id = ?)  = 'admin'",
      [uuid, userId, userId],
    );
  },
  findByStatus(status) {
    return db.getMultipleResult(
      'SELECT * FROM videos AS v WHERE v.status = ? ',
      status,
    );
  },
  findAllByUserId(userId, visibility) {
    return db.getMultipleResult(
      'SELECT * FROM videos AS v WHERE v.user_id = ? AND v.visibility IS NOT ? AND v.status IS NOT ?',
      [userId,
      visibility,
        'blocked']
    );
  },
  findByTagAndMatchName(searchQuery) {
    return db.getMultipleResult(
      `SELECT 
        videos.uuid 
      FROM 
        videos
      WHERE videos.visibility = 'public'
        and upper(videos.name) like upper(?)`, `%${searchQuery}%`
    );
  },
  findByTagForSearch(searchQuery) {
    return db.getMultipleResult(
      `SELECT 
        videos.uuid 
      FROM 
        videos
      WHERE videos.visibility = 'public'
        and tag = ?`, searchQuery
    );
  },
  getLastWatchedVideos(userId) {
    return db.getMultipleResult(
      "SELECT * FROM videos AS v " +
      "JOIN recently_seen as rc " +
      "ON rc.video_id = v.id " +
      "WHERE rc.user_id = ? AND v.status IS NOT ? " +
      "ORDER BY rc.seen_date DESC " +
      "LIMIT 10",
      [userId,'blocked']
    )
  },
  findAllByTagWithSeenStatus(tag, userId) {
    return db.getMultipleResult(
      "SELECT * FROM videos AS v " +
      "JOIN recently_seen as rc " +
      "ON rc.video_id = v.id " +
      "WHERE rc.user_id = ? " +
      "AND v.tag = ? AND v.status IS NOT ?" +
      "ORDER BY v.post_date DESC ",
      [userId, tag, 'blocked']
    )
  }
};

module.exports = query;
