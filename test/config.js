import redis from 'redis'
import redis_mock from 'redis-mock'
jest.spyOn(redis, 'createClient').mockImplementation(redis_mock.createClient);