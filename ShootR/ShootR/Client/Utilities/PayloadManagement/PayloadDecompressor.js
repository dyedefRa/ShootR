﻿function PayloadDecompressor() {
    var that = this,
        PayloadContract,
        CollidableContract,
        ShipContract,
        BulletContract,
        PowerupContract;

    that.LoadContracts = function (contracts) {
        PayloadContract = contracts.PayloadContract;
        CollidableContract = contracts.CollidableContract;
        ShipContract = contracts.ShipContract;
        BulletContract = contracts.BulletContract;
        LeaderboardEntryContract = contracts.LeaderboardEntryContract;
        PowerupContract = contracts.PowerupContract;
    }

    function DecompressCollidable(obj) {
        return {
            Collided: !!obj[CollidableContract.Collided],
            CollidedAt: {
                X: obj[CollidableContract.CollidedAtX],
                Y: obj[CollidableContract.CollidedAtY]
            },
            MovementController: {
                Forces: {
                    X: obj[CollidableContract.ForcesX],
                    Y: obj[CollidableContract.ForcesY]
                },
                Mass: obj[CollidableContract.Mass],
                Position: {
                    X: obj[CollidableContract.PositionX],
                    Y: obj[CollidableContract.PositionY]
                },
                Rotation: obj[CollidableContract.Rotation],
                Velocity: {
                    X: obj[CollidableContract.VelocityX],
                    Y: obj[CollidableContract.VelocityY]
                }
            },
            LifeController: {
                Alive: obj[CollidableContract.Alive],
                Health: obj[CollidableContract.Health]
            },
            ID: obj[CollidableContract.ID],
            Disposed: !!obj[CollidableContract.Disposed]
        };
    }

    function DecompressShip(ship) {
        var result = DecompressCollidable(ship);

        result.MovementController.Moving = {
            RotatingLeft: !!ship[ShipContract.RotatingLeft],
            RotatingRight: !!ship[ShipContract.RotatingRight],
            Forward: !!ship[ShipContract.Forward],
            Backward: !!ship[ShipContract.Backward]
        };
        result.Name = ship[ShipContract.Name];
        result.MaxLife = ship[ShipContract.MaxLife];
        result.Level = ship[ShipContract.Level];
        result.Abilities = {
            Boost: ship[ShipContract.Boost]
        };

        return result;
    }

    function DecompressBullet(bullet) {
        var result = DecompressCollidable(bullet);

        result.DamageDealt = bullet[BulletContract.DamageDealt];

        return result;
    }

    function DecompressPayload(data) {
        return {
            Ships: data[PayloadContract.Ships],
            LeaderboardPosition: data[PayloadContract.LeaderboardPosition],
            Kills: data[PayloadContract.Kills],
            Deaths: data[PayloadContract.Deaths],
            Powerups: data[PayloadContract.Powerups],
            Bullets: data[PayloadContract.Bullets],
            ShipsInWorld: data[PayloadContract.ShipsInWorld],
            BulletsInWorld: data[PayloadContract.BulletsInWorld],
            Experience: data[PayloadContract.Experience],
            ExperienceToNextLevel: data[PayloadContract.ExperienceToNextLevel],
            Notification: data[PayloadContract.Notification],
            LastCommandProcessed: data[PayloadContract.LastCommandProcessed],
            KilledByName: data[PayloadContract.KilledByName],
            KilledByPhoto: data[PayloadContract.KilledByPhoto]
        };
    }

    function DecompressLeaderboardEntry(data) {
        return {
            Name: data[LeaderboardEntryContract.Name],
            Photo: data[LeaderboardEntryContract.Photo],
            ID: data[LeaderboardEntryContract.ID]
            /*
            Level: data[LeaderboardEntryContract.Level],
            Kills: data[LeaderboardEntryContract.Kills],
            Deaths: data[LeaderboardEntryContract.Deaths],
            DamageDealt: data[LeaderboardEntryContract.DamageDealt],
            DamageTaken: data[LeaderboardEntryContract.DamageTaken],
            KillDeathRatio: data[LeaderboardEntryContract.KillDeathRatio]*/

        };
    }

    function DecompressPowerup(data) {
        return {
            MovementController: {
                Position: {
                    X: data[PowerupContract.PositionX],
                    Y: data[PowerupContract.PositionY]
                },
                Rotation: 0
            },
            ID: data[PowerupContract.ID],
            Disposed: data[PowerupContract.Disposed],
            Type: data[PowerupContract.Type],
            LifeController: {
                Alive: true
            }
        };
    }

    that.Decompress = function (data) {
        var payload = DecompressPayload(data),
            shipCount = payload.Ships.length,
            bulletCount = payload.Bullets.length,
            powerupCount = payload.Powerups.length,
            i = 0;

        for (i = 0; i < shipCount; i++) {
            payload.Ships[i] = DecompressShip(payload.Ships[i]);
        }

        for (i = 0; i < bulletCount; i++) {
            payload.Bullets[i] = DecompressBullet(payload.Bullets[i]);
        }

        for (i = 0; i < powerupCount; i++) {
            payload.Powerups[i] = DecompressPowerup(payload.Powerups[i]);
        }

        return payload;
    }

    that.DecompressLeaderboard = function (data) {
        var payload = [],
            leaderboardEntryCount = data.length;

        for (i = 0; i < leaderboardEntryCount; i++) {
            var item = DecompressLeaderboardEntry(data[i]);
            item.Position = i + 1;

            payload.push(item);
        }

        return payload;
    }
}