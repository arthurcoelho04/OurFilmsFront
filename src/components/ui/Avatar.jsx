import { useState } from 'react';
import { userPhotoUrl } from '../../services/api';

export default function Avatar({ user, index = 0, className = '' }) {
  const url = userPhotoUrl(user);
  const [failedUrl, setFailedUrl] = useState(null);
  return <span className={`avatar avatar-${index} ${className}`} title={user.nome}>
    {url && failedUrl !== url
      ? <img src={url} alt="" onError={() => setFailedUrl(url)}/>
      : user.nome.slice(0, 1).toUpperCase()}
  </span>;
}
