import { useState, useEffect } from 'react';

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface Release {
  tag_name: string;
  html_url: string;
  assets: ReleaseAsset[];
}

interface Downloads {
  windows: ReleaseAsset | null;
  macos: ReleaseAsset | null;
  linux: ReleaseAsset | null;
}

const Download = () => {
  const [release, setRelease] = useState<Release | null>(null);
  const [downloads, setDownloads] = useState<Downloads>({
    windows: null,
    macos: null,
    linux: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDownloads() {
      try {
        const response = await fetch(
          'https://api.github.com/repos/ammusto/kashshaf/releases/latest'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch release information');
        }

        const data: Release = await response.json();
        setRelease(data);

        const windowsAsset = data.assets.find((a) => a.name.endsWith('.msi'));
        const macosAsset = data.assets.find((a) => a.name.endsWith('.dmg'));
        const linuxAsset = data.assets.find((a) => a.name.endsWith('.AppImage'));

        setDownloads({
          windows: windowsAsset || null,
          macos: macosAsset || null,
          linux: linuxAsset || null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadDownloads();
  }, []);

  const formatSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="download-section">
      <h1>Download al-Kashshāf</h1>

      {loading ? (
        <p className="loading">Loading release information...</p>
      ) : error ? (
        <div>
          <p className="version-badge">Unable to load release info</p>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Please visit the{' '}
            <a href="https://github.com/ammusto/kashshaf/releases/latest" target="_blank" rel="noopener noreferrer">
              GitHub releases page
            </a>{' '}
            directly.
          </p>
        </div>
      ) : (
        <>
          <span className="version-badge">
            Version: {release?.tag_name || 'Unknown'}
          </span>

          <div className="download-cards">
            <div className="download-card">
              <h3>Windows</h3>
              <p className="file-type">
                {downloads.windows ? (
                  <>MSI Installer ({formatSize(downloads.windows.size)})</>
                ) : (
                  'Not available'
                )}
              </p>
              {downloads.windows ? (
                <a href={downloads.windows.browser_download_url}>
                  Download
                </a>
              ) : (
                <a href="#" className="disabled">Unavailable</a>
              )}
            </div>

            <div className="download-card">
              <h3>macOS</h3>
              <p className="file-type">
                {downloads.macos ? (
                  <>DMG Image ({formatSize(downloads.macos.size)})</>
                ) : (
                  'Not available'
                )}
              </p>
              {downloads.macos ? (
                <a href={downloads.macos.browser_download_url}>
                  Download
                </a>
              ) : (
                <a href="#" className="disabled">Unavailable</a>
              )}
            </div>

            <div className="download-card">
              <h3>Linux</h3>
              <p className="file-type">
                {downloads.linux ? (
                  <>AppImage ({formatSize(downloads.linux.size)})</>
                ) : (
                  'Not available'
                )}
              </p>
              {downloads.linux ? (
                <a href={downloads.linux.browser_download_url}>
                  Download
                </a>
              ) : (
                <a href="#" className="disabled">Unavailable</a>
              )}
            </div>
          </div>
        </>
      )}

      <div className="download-note">
        <p>
          <strong>First-time setup:</strong> On first launch, al-Kashshāf will offer to download
          the corpus data (currently ~8 GB). You can also choose to use Online Mode if you have
          limited storage space.
        </p>
        <p style={{ marginTop: '15px' }}>
          View all releases on{' '}
          <a href="https://github.com/ammusto/kashshaf/releases" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
};

export default Download;
