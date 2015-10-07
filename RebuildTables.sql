drop table entry
drop table word

CREATE TABLE [dbo].[Word] (
    [ID]   INT           IDENTITY (1, 1) NOT NULL,
    [WordString] VARCHAR (255) NOT NULL,
    PRIMARY KEY CLUSTERED ([ID] ASC)
);

CREATE TABLE [dbo].[Entry] (
    [ID]     INT        IDENTITY (1, 1) NOT NULL,
    [Sentiment]  FLOAT (53) NOT NULL,
    [WordID] INT        NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([WordID]) REFERENCES [dbo].[Word] ([ID])
);