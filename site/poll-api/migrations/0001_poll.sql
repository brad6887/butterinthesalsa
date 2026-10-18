CREATE TABLE totals ( poll_id TEXT NOT NULL CHECK (poll_id = 'salsa-crisis-v1'), option_id TEXT NOT NULL CHECK (option_id IN ('butter','salsa','absolutely-not','whatever')), count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0), PRIMARY KEY (poll_id, option_id) );
INSERT INTO totals (poll_id,option_id) VALUES ('salsa-crisis-v1','butter'),('salsa-crisis-v1','salsa'), ('salsa-crisis-v1','absolutely-not'),('salsa-crisis-v1','whatever');
CREATE TABLE ballots ( poll_id TEXT NOT NULL, voter_hash TEXT NOT NULL, option_id TEXT NOT NULL, PRIMARY KEY (poll_id,voter_hash), FOREIGN KEY (poll_id,option_id) REFERENCES totals (poll_id,option_id) );
CREATE TRIGGER count_ballot AFTER INSERT ON ballots BEGIN UPDATE totals SET count = count + 1 WHERE poll_id = NEW.poll_id AND option_id = NEW.option_id; END;
