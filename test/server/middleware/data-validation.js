import { expect } from 'chai';
import { idValidator, getCompanionshipScores } from '/server/middleware/data-validation';
import Crop from '/server/models/crop';
import { Types } from 'mongoose';
const { ObjectId } = Types;

describe('data-validation', () => {
	let validId;
	describe('#idValidation()', () => {
		it('should reject invalid ids', () => {
			const ids = ['12345', 'JF(jrf9Nd3gkd0fj2ln  j F)'];
			let error;
			const next = err => {
				error = err;
			};
			idValidator(ids, next);
			expect(error.status).to.equal(400);
		});
		it('should accept valid ids', () => {
			const ids = [ObjectId(), ObjectId()];
			let error;
			const next = err => {
				error = err;
			};
			idValidator(ids, next);
			expect(typeof error).to.equal('undefined');
		});
	});
	describe('#getCompanionshipScores()', () => {
		const ids = [ObjectId()];
		const a = ObjectId();
		const b = ObjectId();
		const c = ObjectId();
		const sample = [
			[
				{
					crop1: ids[0],
					crop2: a,
					compatibility: 3
				},
				{
					crop1: b,
					crop2: ids[0],
					compatibility: -1
				},
				{
					crop1: ids[0],
					crop2: c,
					compatibility: 3
				}
			]
		];
		it('should return 1 or -1 for correct crops', () => {
			const results = getCompanionshipScores(sample, ids);
			expect(results[a]).to.equal(1);
			expect(results[b]).to.equal(-1);
			expect(results[c]).to.equal(1);
		});
		it('should override positive companionships with a negative', () => {
			ids.push(ObjectId());
			const d = ObjectId();
			const newData = [
				{
					crop1: ids[1],
					crop2: a,
					compatibility: -1
				},
				{
					crop1: b,
					crop2: ids[1],
					compatibility: 3
				},
				{
					crop1: ids[1],
					crop2: d,
					compatibility: 2
				}
			];
			sample.push(newData);
			const results = getCompanionshipScores(sample, ids);
			const max = 6;
			expect(results[a]).to.equal(-1);
			expect(results[b]).to.equal(-1);
			expect(results[c]).to.equal(3 / max);
			expect(results[d]).to.equal(2 / max);
		});
	});
});
