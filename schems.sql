create table profiles (
                          id uuid references auth.users on delete cascade primary key,
                          username text,
                          avatar_url text,
                          created_at timestamp with time zone default now()
);

create table channels (
                          id uuid default gen_random_uuid() primary key,
                          owner_id uuid references profiles(id) on delete cascade,
                          name text not null,
                          description text,
                          avatar_url text,
                          banner_url text,
                          description text,
                          created_at timestamp with time zone default now()
);

create table videos (
                        id uuid default gen_random_uuid() primary key,
                        user_id uuid references profiles(id) on delete cascade,
                        channel_id uuid references channels(id) on delete cascade,
                        title text not null,
                        description text,
                        video_url text not null,
                        duration integer default 0
                            thumbnail_url text,
                        created_at timestamp with time zone default now()
);

create table subscriptions (
                               id uuid default gen_random_uuid() primary key,
                               subscriber_id uuid references profiles(id),
                               channel_id uuid references channels(id),
                               created_at timestamp with time zone default now(),
                               unique(subscriber_id, channel_id)
);

create table video_views (
                             id uuid default gen_random_uuid() primary key,
                             video_id uuid references videos(id) on delete cascade,
                             viewer_id uuid references profiles(id) null, -- optional
                             created_at timestamp with time zone default now()
);

create table video_likes (
                             id uuid default gen_random_uuid() primary key,
                             video_id uuid references videos(id) on delete cascade,
                             user_id uuid references profiles(id) on delete cascade,
                             type text check (type in ('like','dislike')), -- optional dislike
                             created_at timestamp with time zone default now(),
                             unique(video_id, user_id) -- each user can like/dislike once
);

alter table profiles enable row level security;
alter table channels enable row level security;
alter table videos enable row level security;
alter table vidoe_views enable row level security;
alter table vidoe_likes enable row level security;

create policy "Public videos are viewable"
on videos for select
                         using (true);

create policy "Users can insert their own videos"
on videos for insert
with check (auth.uid() = user_id);