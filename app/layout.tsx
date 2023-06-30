import { Figtree } from 'next/font/google';
import SupabaseProvider from '@/providers/SupabaseProvider';
import UserProvider from '@/providers/UserProvider';
import ModalProvider from '@/providers/ModalProvider';
import ToasterProvider from '@/providers/ToasterProvider';
import LikedSongsProvider from '@/providers/LikedSongsProvider';

import getActiveProductsWithPrices from '@/actions/getActiveProductsWithPrices';
import getLikedSongs from '@/actions/getLikedSongs';
import getPlaylistsByUserId from '@/actions/getPlaylistsByUserId';

import Sidebar from '@/components/Sidebar';
import Player from '@/components/player/Player';

import './globals.css';
import getLikedPlaylists from '@/actions/getLikedPlaylists';
import LikedPlaylistsProvider from '@/providers/LikedPlaylistsProvider';

const font = Figtree({ subsets: ['latin'] });

export const metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music!',
}

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const likedSongs = await getLikedSongs();
  const userPlaylists = await getPlaylistsByUserId();
  const likedPlaylists = await getLikedPlaylists();
  const products = await getActiveProductsWithPrices();

  return (
    <html lang="en">
      <body className={`${font.className} grid grid-rows-[minmax(200px,1fr),auto] h-full`}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <LikedSongsProvider songs={likedSongs} />
            <LikedPlaylistsProvider playlists={likedPlaylists} />
            <ModalProvider products={products} />
            <Sidebar playlists={userPlaylists}>
              {children}
            </Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
