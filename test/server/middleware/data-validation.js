import { expect } from 'chai';
import { Processor } from '/server/processor';
import { Types } from 'mongoose';
const { ObjectId } = Types;

describe('data-validation', () => {
	describe('#getCropRelationshipScores()', () => {
		const ids = [ObjectId()];
		const a = ObjectId();
		const b = ObjectId();
		const c = ObjectId();
		const sample = [
			[
				{
					crop0: ids[0],
					crop1: a,
					compatibility: 3
				},
				{
					crop0: b,
					crop1: ids[0],
					compatibility: -1
				},
				{
					crop0: ids[0],
					crop1: c,
					compatibility: 3
				}
			]
		];
		it('should return 1 or -1 for correct crops', () => {
			const results = Processor.calculateCropRelationshipScores(sample, ids);
			expect(results[a]).to.equal(1);
			expect(results[b]).to.equal(-1);
			expect(results[c]).to.equal(1);
		});
		it('should override positive relationships with a negative', () => {
			ids.push(ObjectId());
			const d = ObjectId();
			const newData = [
				{
					crop0: ids[1],
					crop1: a,
					compatibility: -1
				},
				{
					crop0: b,
					crop1: ids[1],
					compatibility: 3
				},
				{
					crop0: ids[1],
					crop1: d,
					compatibility: 2
				}
			];
			sample.push(newData);
			const results = Processor.calculateCropRelationshipScores(sample, ids);
			const max = 6;
			expect(results[a]).to.equal(-1);
			expect(results[b]).to.equal(-1);
			expect(results[c]).to.equal(3 / max);
			expect(results[d]).to.equal(2 / max);
		});
	});
});
